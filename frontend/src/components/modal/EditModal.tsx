import React from "react"
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import PrimaryButton from "@/components/button/PrimaryButton";
import {
    TextField,
    Fade,
    Modal,
} from '@mui/material/';
import { IoIosClose } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateContact, getAllContacts } from "@/lib/features/contact/contactSlice";
import { toast } from "react-toastify";



interface EditModalProps {
    open: boolean;
    handleClose: () => void;
    contactData: IFormInput | null;

}

interface IFormInput {
    _id: string | number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
}


const EditContactModal: React.FC<EditModalProps> = ({ open, handleClose, contactData }) => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.contacts);

    const { handleSubmit, control, formState: { errors }, setValue } = useForm<IFormInput>({
        defaultValues: contactData || {},
    });

    React.useEffect(() => {
        if (contactData) {
            setValue("first_name", contactData.first_name);
            setValue("last_name", contactData.last_name);
            setValue("email", contactData.email);
            setValue("phone_number", contactData.phone_number);
        }
    }, [contactData, setValue]);

    // function to edit a contact
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            if (!contactData) {
                toast.error("Contact data is missing");
                return;
            }
            const updatedData = {
                contactId: contactData._id,
                contactData: {
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    phone_number: data.phone_number,
                },
            };
            const result = await dispatch(updateContact(updatedData));
            if (updateContact.fulfilled.match(result)) {
                await dispatch(getAllContacts());
                handleClose();
                toast.success('Contact edited successfully')
            } else if (updateContact.rejected.match(result)) {
                toast.error(Array.isArray(result.payload) ? result.payload.join(', ') : result.payload as string);
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    };




    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                // disableEscapeKeyDown
                className='outline-none w-full flex items-center justify-center backdrop-blur-sm px-2'
            >

                <Fade in={open}>
                    <div className='w-full lg:w-2/4 bg-white'>

                        {/* Close Icon */}
                        <div className='border-b-4 text-2xl font-bold border-gray-400 p-4 flex items-center justify-between'>
                            <h1> Edit Contact</h1>
                            <IoIosClose
                                onClick={handleClose}
                                className=" cursor-pointer"
                            />
                        </div>

                        {/* Modal content */}
                        <div>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="w-full h-full"
                            >
                                <div className="py-10 px-5 md:px-16 lg:px-16 md:py-16 grid grid-cols-1 gap-8">
                                    {/* First Name */}
                                    <div>
                                        <Controller
                                            name="first_name"
                                            control={control}
                                            rules={{
                                                required: " First Name is required"
                                            }}
                                            render={({ field }) =>
                                                <TextField
                                                    {...field}
                                                    id="outlined-basic"
                                                    label="First Name"
                                                    variant="outlined"
                                                    className="w-full"
                                                    autoComplete="off"
                                                    type="text"
                                                    sx={{
                                                        '& .css-18pjc51-MuiFormLabel-root-MuiInputLabel-root.Mui-focused ': {
                                                            color: 'red',
                                                        },
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': {
                                                                borderColor: 'red',
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'red',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: 'red',
                                                            },
                                                        },
                                                    }}
                                                />
                                            }
                                        />
                                        {errors.first_name && (
                                            <p role="alert" className="text-red-500 text-sm">{errors.first_name.message}</p>
                                        )}
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <Controller
                                            name="last_name"
                                            control={control}
                                            render={({ field }) =>
                                                <TextField
                                                    {...field}
                                                    id="outlined-basic"
                                                    label="Last Name"
                                                    variant="outlined"
                                                    className="w-full"
                                                    autoComplete="off"
                                                    type="text"
                                                    sx={{
                                                        '& .css-18pjc51-MuiFormLabel-root-MuiInputLabel-root.Mui-focused ': {
                                                            color: 'red',
                                                        },
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': {
                                                                borderColor: 'red',
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'red',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: 'red',
                                                            },
                                                        },
                                                    }}
                                                />
                                            }
                                        />
                                        {errors.last_name && (
                                            <p role="alert" className="text-red-500 text-sm">{errors.last_name.message}</p>
                                        )}
                                    </div>

                                    {/* email */}
                                    <div>
                                        <Controller
                                            name="email"
                                            control={control}
                                            rules={{
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: "Invalid email address",
                                                }
                                            }}
                                            render={({ field }) =>
                                                <TextField
                                                    {...field}
                                                    id="outlined-basic"
                                                    label="Email"
                                                    variant="outlined"
                                                    className="w-full"
                                                    autoComplete="off"
                                                    type="text"
                                                    sx={{
                                                        '& .css-18pjc51-MuiFormLabel-root-MuiInputLabel-root.Mui-focused ': {
                                                            color: 'red',
                                                        },
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': {
                                                                borderColor: 'red',
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'red',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: 'red',
                                                            },
                                                        },
                                                    }}
                                                />
                                            }
                                        />
                                        {errors.email && (
                                            <p role="alert" className="text-red-500 text-sm">{errors.email.message}</p>
                                        )}
                                    </div>

                                    {/* contact */}
                                    <div>
                                        <Controller
                                            name="phone_number"
                                            control={control}
                                            rules={{
                                                required: "Phone Number is required",
                                                pattern: {
                                                    value: /\d+/,
                                                    message: "Only digits are allowed in this field"
                                                },
                                            }}
                                            render={({ field }) =>
                                                <TextField
                                                    {...field}
                                                    id="outlined-basic"
                                                    label="Phone Number"
                                                    variant="outlined"
                                                    className="w-full"
                                                    autoComplete="off"
                                                    type="text"
                                                    sx={{
                                                        '& .css-18pjc51-MuiFormLabel-root-MuiInputLabel-root.Mui-focused ': {
                                                            color: 'red',
                                                        },
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': {
                                                                borderColor: 'red',
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'red',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: 'red',
                                                            },
                                                        },
                                                    }}
                                                />
                                            }
                                        />
                                        {errors.phone_number && (
                                            <p role="alert" className="text-red-500 text-sm">{errors.phone_number.message}</p>
                                        )}
                                    </div>

                                    {/* button */}
                                    <div className="w-full flex justify-center">
                                        <PrimaryButton
                                            text={loading ? "Updating..." : "Update"}
                                            className="text-sm w-3/4"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </Fade>
            </Modal>


        </>
    )
}

export default EditContactModal