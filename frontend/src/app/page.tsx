"use client"





import React from "react";
import DefaultLayout from "./DefaultLayout";
import { DataGrid, GridActionsCellItem, GridColDef, GridPagination, GridRowId, GridToolbar } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { MdOutlineVisibility, MdDelete, MdOutlineEdit } from "react-icons/md";
import Box from "@mui/material/Box";
import { getAllContacts, getSingleContact, deleteContact } from "@/lib/features/contact/contactSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import AlertDialog from "@/components/dialogue/Dialogue";
import { toast } from "react-toastify";
import EditAdminModal from "@/components/modal/EditModal";
import { useRouter } from "next/navigation";
import { stringify } from 'querystring';


type Contact = {
  _id: GridRowId;
  name: string;
  email: string;
  phone_number: string;
}


type Row = Contact & {
  initials?: string;
  avatarColor?: string;
  isGroup?: boolean;
};


const Home = () => {
  const dispatch = useAppDispatch();
  const { contacts, success } = useAppSelector((state) => state.contacts)
  const [selectedContact, setSelectedContact] = React.useState(null);
  const [dialogueVisible, setDialogueVisible] = React.useState(false);
  const router = useRouter();

  const [openModal, setOpenModal] = React.useState(false);
  // function to open the edit modal
  const showModal = (newOpen: boolean) => () => {
    if (!newOpen) {
      setSelectedContact(null);
    }
    setOpenModal(newOpen);
  };



  React.useEffect(() => {
    dispatch(getAllContacts());
  }, [dispatch]);

  // Helper function to get initials
  const getInitials = (first_name: string, last_name: string): string => {
    const firstInitial = first_name.charAt(0).toUpperCase();
    const lastInitial = last_name.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  // Helper function to generate a color based on the user's name
  const getAvatarColor = (name: string): string => {
    const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  // Prepare contacts data
  const rowsWithGroups = React.useMemo(() => {
    const formattedContacts = contacts
      .map(contact => ({
        ...contact,
        name: `${contact.first_name} ${contact.last_name}`.trim(),
        initials: getInitials(contact.first_name, contact.last_name),
        avatarColor: getAvatarColor(`${contact.first_name} ${contact.last_name}`),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const groupedContacts = formattedContacts.reduce((groups, contact) => {
      const letter = contact.name.charAt(0).toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(contact);
      return groups;
    }, {} as Record<string, Contact[]>);

    return Object.keys(groupedContacts).flatMap(letter => [
      { _id: `group-${letter}`, name: letter, isGroup: true },
      ...groupedContacts[letter],
    ]) as Row[];
  }, [contacts]);

  // Function for the view icon
  const view = React.useCallback(
    (id: GridRowId) => () => {
      const contact = contacts.find((contact) => contact._id === id);
      if (contact) {
        const queryString = stringify({
          first_name: contact.first_name,
          last_name: contact.last_name,
          email: contact.email,
          phone_number: contact.phone_number,
          avatarColor: getAvatarColor(`${contact.first_name} ${contact.last_name}`),
          initials: getInitials(contact.first_name, contact.last_name),
        });

        router.push(`/person/${id}?${queryString}`);
      } else {
        toast.error("Contact not found");
      }
    },
    [contacts, router]
  );

  // function for the edit icon
  const edit = React.useCallback(
    (id: GridRowId) => async () => {
      try {
        const result = await dispatch(getSingleContact(id));
        if (getSingleContact.fulfilled.match(result)) {
          setOpenModal(true);
          setSelectedContact(result.payload);
        } else if (getSingleContact.rejected.match(result)) {
          toast.error(result.payload as string)
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred");
        }
      }
    },
    [dispatch],
  );

  // Function for the delete icon
  const disable = React.useCallback(
    (id: GridRowId) => async () => {
      try {
        const result = await dispatch(getSingleContact(id));
        console.log(result)
        if (getSingleContact.fulfilled.match(result)) {
          setDialogueVisible(true);
          setSelectedContact(result.payload._id);
          console.log(result.payload._id)
        } else if (getSingleContact.rejected.match(result)) {
          toast.error(result.payload as string)
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred");
        }
      }
    },
    [dispatch],
  );

  // function to delete a contact
  const handleDeleteConfirm = async () => {
    try {
      if (!selectedContact) {
        toast.error("Contact not found");
        return;
      }

      const result = await dispatch(deleteContact(selectedContact));
      if (deleteContact.fulfilled.match(result)) {
        await dispatch(getAllContacts());
        toast.success('Contact deleted successfully')
        setDialogueVisible(false);
        console.log(selectedContact)
      } else if (deleteContact.rejected.match(result)) {
        toast.error(result.payload as string)
        setDialogueVisible(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
      setDialogueVisible(false);
    }
  }

  // Define the columns
  const columns = React.useMemo<GridColDef<Row>[]>(
    () => [
      {
        field: "avatar",
        renderHeader: () => (
          <p className='font-bold'>
            {'Avatar'}
          </p>
        ),
        headerAlign: "left",
        align: "center",
        type: "number",
        width: 200,
        renderCell: (params) => {
          // Check if the row is a group
          if ('isGroup' in params.row && params.row.isGroup) {
            return null;
          }
          const { initials, avatarColor } = params.row;
          return (
            <div className="flex items-center h-full">
              <div
                className="w-10 h-10 rounded-full text-white font-bold text-lg flex items-center justify-center"
                style={{
                  backgroundColor: avatarColor
                }}
              >
                {initials}
              </div>
            </div>
          );
        },
      },
      {
        field: 'name',
        renderHeader: () => (
          <p className='font-bold'>
            {'Name'}
          </p>
        ),
        type: 'string',
        editable: true,
        flex: 1,
        minWidth: 300,
        renderCell: (params) => 'isGroup' in params.row ? <strong>{params.value}</strong> : params.value,

      },
      {
        field: 'actions',
        type: 'actions',
        width: 80,
        renderHeader: () => (
          <p className='font-bold'>
            {'Action'}
          </p>
        ),
        getActions: (params) => {
          // Check if the row is a group
          const row = params.row as Row;
          if ('isGroup' in row && row.isGroup) {
            return [];
          }
          return [
            <GridActionsCellItem
              key={`details-${params.id}`}
              icon={<MdOutlineVisibility />}
              label="View details"
              onClick={view(params.id as number)}
              showInMenu
            />,
            <GridActionsCellItem
              key={`edit-${params.id}`}
              icon={<MdOutlineEdit className='text-xl font-bold text-gray-950' />}
              label="Edit"
              onClick={edit(params.id)}
              showInMenu
            />,
            <GridActionsCellItem
              key={`disable-${params.id}`}
              icon={<MdDelete />}
              label="Delete"
              onClick={disable(params.id as number)}
              showInMenu
            />,
          ];
        },
      },
    ],
    [view, disable, edit]
  );

  // custom styles for the no results overlay
  const StyledGridOverlay = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .no-results-primary': {
      fill: '#DC3545',
    },
    '& .no-results-secondary': {
      fill: '#DC3545',
    },
  }));

  //function for the no results overlay
  const CustomNoResultsOverlay = () => {
    return (
      <StyledGridOverlay>
        <Box sx={{
          height: 400,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            width='50'
            height='50'
            viewBox="0 0 523 299"
            aria-hidden
            focusable="false"
          >
            <path
              className="no-results-primary"
              d="M262 20c-63.513 0-115 51.487-115 115s51.487 115 115 115 115-51.487 115-115S325.513 20 262 20ZM127 135C127 60.442 187.442 0 262 0c74.558 0 135 60.442 135 135 0 74.558-60.442 135-135 135-74.558 0-135-60.442-135-135Z"
            />
            <path
              className="no-results-primary"
              d="M348.929 224.929c3.905-3.905 10.237-3.905 14.142 0l56.569 56.568c3.905 3.906 3.905 10.237 0 14.143-3.906 3.905-10.237 3.905-14.143 0l-56.568-56.569c-3.905-3.905-3.905-10.237 0-14.142ZM212.929 85.929c3.905-3.905 10.237-3.905 14.142 0l84.853 84.853c3.905 3.905 3.905 10.237 0 14.142-3.905 3.905-10.237 3.905-14.142 0l-84.853-84.853c-3.905-3.905-3.905-10.237 0-14.142Z"
            />
            <path
              className="no-results-primary"
              d="M212.929 185.071c-3.905-3.905-3.905-10.237 0-14.142l84.853-84.853c3.905-3.905 10.237-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-84.853 84.853c-3.905 3.905-10.237 3.905-14.142 0Z"
            />
            <path
              className="no-results-secondary"
              d="M0 43c0-5.523 4.477-10 10-10h100c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 53 0 48.523 0 43ZM0 89c0-5.523 4.477-10 10-10h80c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 99 0 94.523 0 89ZM0 135c0-5.523 4.477-10 10-10h74c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 181c0-5.523 4.477-10 10-10h80c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 227c0-5.523 4.477-10 10-10h100c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM523 227c0 5.523-4.477 10-10 10H413c-5.523 0-10-4.477-10-10s4.477-10 10-10h100c5.523 0 10 4.477 10 10ZM523 181c0 5.523-4.477 10-10 10h-80c-5.523 0-10-4.477-10-10s4.477-10 10-10h80c5.523 0 10 4.477 10 10ZM523 135c0 5.523-4.477 10-10 10h-74c-5.523 0-10-4.477-10-10s4.477-10 10-10h74c5.523 0 10 4.477 10 10ZM523 89c0 5.523-4.477 10-10 10h-80c-5.523 0-10-4.477-10-10s4.477-10 10-10h80c5.523 0 10 4.477 10 10ZM523 43c0 5.523-4.477 10-10 10H413c-5.523 0-10-4.477-10-10s4.477-10 10-10h100c5.523 0 10 4.477 10 10Z"
            />
          </svg>
          <p>No results found.</p>
        </Box>
      </StyledGridOverlay>
    );
  }

  // custom pagination
  const CustomPagination = () => {
    return (

      <GridPagination sx={
        {
          '& .MuiTablePagination-toolbar': {
            margin: 0,
            padding: 0,
          },
          '& .MuiTablePagination-selectLabel': {
            margin: 0,
            padding: 0,
          },
          '& .MuiTablePagination-input': {
            margin: 0,
            padding: 0,
            marginRight: '20px'
          },
          '& .MuiTablePagination-displayedRows': {
            margin: 0,
            padding: 0,
          },
          '& .MuiTablePagination-actions': {
            margin: 0,
            padding: 0,
          },
        }
      } />
    );
  }

  return (
    <DefaultLayout headerChildren={<p className="text-blue-900">View all contacts</p>}>

      <div className="mx-auto py-10 grid grid-cols-1 gap-8 grow">
        <h6 className="text-blue-900 flex lg:hidden">View all contacts</h6>
        <Box
          sx={{
            height: 'auto',
            '& .MuiDataGrid-root': {
              height: 'auto !important',
            },
            '& .MuiDataGrid-main': {
              height: 'auto !important',
            },
            '& .MuiDataGrid-cell': {
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              fontSize: '1.1rem'
            },
            '& .MuiDataGrid-toolbarContainer': {
              padding: '1.5rem 1rem',
            },
            '& .MuiButton-text': {
              color: '#000',
            },
            '& .css-1eed5fa-MuiInputBase-root-MuiInput-root::after': {
              borderBottom: '2px solid #000'
            },
            '& .MuiDataGrid-cell:hover': {
              fontWeight: 'bold',
            },
            '& .MuiDataGrid-cell:focus': {
              fontWeight: 'bold',
            },
            '& .MuiDataGrid-scrollbar': {
              display: 'none',
            },
          }}>
          <DataGrid
            getRowId={(row) => row._id}
            rows={rowsWithGroups}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 25,
                },
              },
            }}
            pageSizeOptions={[25, 50, 100]}
            slots={{
              toolbar: GridToolbar,
              noResultsOverlay: CustomNoResultsOverlay,
              pagination: CustomPagination
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
          />
        </Box>
      </div>

      {/* Edit modal */}
      <EditAdminModal
        open={openModal}
        handleClose={showModal(false)}
        contactData={selectedContact}
      />

      {/* Dialogue */}
      {dialogueVisible && success && (
        <AlertDialog
          text='Are you sure you want to delete this contact'
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDialogueVisible(false)}
        />
      )}

    </DefaultLayout>
  );
};

export default Home;
