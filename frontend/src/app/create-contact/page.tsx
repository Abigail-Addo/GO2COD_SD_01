'use client'

import * as React from 'react';
import PrimaryButton from "@/components/button/PrimaryButton";
import { TextField } from '@mui/material/';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { toast } from "react-toastify";
import DefaultLayout from '@/app/DefaultLayout';
import { createContact, getAllContacts } from "@/lib/features/contact/contactSlice";


interface IFormInput {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
}

const CreateAdmin = () => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.contacts)
    const { handleSubmit, control, formState: { errors }, reset } = useForm<IFormInput>({
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone_number: '',
        },
    });

    React.useEffect(() => {
        dispatch(getAllContacts());
    }, [dispatch]);




    // function for creating an admin
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            const result = await dispatch(createContact(data));
            console.log(result)
            if (createContact.fulfilled.match(result)) {
                toast.success('Contact created successfully')
                reset();
            } else if (createContact.rejected.match(result)) {
                toast.error(result.payload as string)
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    }

    return (
        <>
            <DefaultLayout headerChildren={<p className="text-blue-900">Add New Contact</p>}>

                <div className="mx-auto h-fit py-10 grid grid-cols-1 gap-8">
                    <h6 className='flex lg:hidden md:w-3/4 md:mx-auto text-blue-900'>Add New Contact</h6>
                    {/* Form */}
                    <div className="md:w-3/4 lg:w-2/4 md:mx-auto shadow-2xl">
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
                                            required: "First name is required"
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
                                            />
                                        }
                                    />
                                    {errors.email && (
                                        <p role="alert" className="text-red-500 text-sm">{errors.email.message}</p>
                                    )}
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <Controller
                                        name="phone_number"
                                        control={control}
                                        rules={{
                                            required: "Contact is required",
                                            pattern: {
                                                value: /\d+/,
                                                message: "Only digits are allowed in this field"
                                            },
                                        }}
                                        render={({ field }) =>
                                            <TextField
                                                {...field}
                                                id="outlined-basic"
                                                label="Contact"
                                                variant="outlined"
                                                className="w-full"
                                                autoComplete="off"
                                                type="text"
                                            />
                                        }
                                    />
                                    {errors.phone_number && (
                                        <p role="alert" className="text-red-500 text-sm">{errors.phone_number.message}</p>
                                    )}
                                    <div>

                                    </div>
                                </div>

                                {/* button */}
                                <div className="w-full flex justify-center">
                                    <PrimaryButton
                                        text={loading ? "Adding..." : "Add"}
                                        className="text-sm w-3/4"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>


            </DefaultLayout>
        </>
    )
}

export default CreateAdmin;

