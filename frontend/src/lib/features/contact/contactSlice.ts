import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Contact {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

export interface ContactSliceState {
  contacts: Contact[];
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: ContactSliceState = {
  contacts: [],
  loading: false,
  success: false,
  error: null,
};

// asyncthunk to fetch all contacts
export const getAllContacts = createAsyncThunk(
  "contacts/getAllContacts",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/`);
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// asyncthunk to create contact
export const createContact = createAsyncThunk(
  "contacts/createContact",
  async (contactData: Partial<Contact>, thunkAPI) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/create`,
        {
          method: "POST",
          body: JSON.stringify(contactData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (response.status !== 200 && response.status !== 201) {
        return thunkAPI.rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

//asyncthunk to fetch a single contact by id
export const getSingleContact = createAsyncThunk(
  "contacts/getSingleContact",
  async (contactId: string | number, thunkAPI) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${contactId}`
      );
      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message);
      }
      console.log(data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// asyncthunk to update a contact
export const updateContact = createAsyncThunk(
  "contact/updateContact",
  async (
    {
      contactId,
      contactData,
    }: { contactId: string | number; contactData: Partial<Contact> },
    thunkAPI
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${contactId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactData),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message);
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// asyncthunk to delete a contact
export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (contactId: string | number, thunkAPI) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${contactId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (!response.ok) {
        return thunkAPI.rejectWithValue(result.message);
      }
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const contactSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // create contact
      .addCase(createContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.contacts.push(action.payload);
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })
      // get all contacts
      .addCase(getAllContacts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.contacts = action.payload;
      })
      .addCase(getAllContacts.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })
      // get a single contact
      .addCase(getSingleContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleContact.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.contacts = state.contacts.map((contact) =>
          contact._id === action.payload._id ? action.payload : contact
        );
      })
      .addCase(getSingleContact.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })
      // update a contact
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.contacts = state.contacts.map((contact) =>
          contact._id === action.payload._id ? action.payload : contact
        );
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })
      // delete a contact
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.contacts = state.contacts.filter(
          (contact) => contact._id !== action.payload._id
        );
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export default contactSlice.reducer;
