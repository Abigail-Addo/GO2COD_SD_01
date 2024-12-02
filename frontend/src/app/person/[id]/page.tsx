"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import DefaultLayout from "@/app/DefaultLayout";
import { BiLogoWhatsapp, BiLogoTelegram } from "react-icons/bi";

const ContactProfile = () => {
    const searchParams = useSearchParams();

    const first_name = searchParams.get("first_name");
    const last_name = searchParams.get("last_name");
    const email = searchParams.get("email");
    const phone_number = searchParams.get("phone_number");
    const avatarColor = searchParams.get("avatarColor");
    const initials = searchParams.get("initials");

    // Construct the WhatsApp link
    const whatsappLink = phone_number
        ? `https://wa.me/${phone_number}?text=Hi%20${first_name || "there"}!`
        : null;

    // Construct the Telegram link
    const telegramLink = phone_number
        ? `https://t.me/${phone_number}`
        : null;

    return (
        <DefaultLayout headerChildren={<p className="text-blue-900 dark:text-gray-200">Contact Profile</p>}>
            <div className="mx-auto h-fit py-10 grid grid-cols-1 gap-8">
                <h6 className="text-blue-900 flex lg:hidden md:w-3/4 mx-auto">Contact Profile</h6>

                <div className="border border-gray-300 w-full h-full md:w-3/4 lg:w-2/4 mx-auto grid grid-cols-1 gap-4 py-10 rounded">
                    <div className="grid grid-cols-1 gap-8 px-3">
                        <div className="flex gap-4">
                            <div
                                className="w-32 h-32 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                                style={{ backgroundColor: avatarColor || "#000" }}
                            >
                                {initials || ""}
                            </div>
                            <div className="flex flex-col justify-end">
                                <div className="flex items-center gap-2">
                                    <h1 className="font-bold text-2xl">{first_name || "N/A"} {last_name || ""}</h1>
                                </div>
                                <div className="flex pt-4 justify-evenly">
                                    {whatsappLink && (
                                        <a
                                            href={whatsappLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="pb-2 flex flex-col"
                                        >
                                            <BiLogoWhatsapp className="text-2xl text-gray-500" />
                                        </a>
                                    )}
                                    {telegramLink && (
                                        <a
                                            href={telegramLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="pb-2 flex flex-col"
                                        >
                                            <BiLogoTelegram className="text-2xl text-gray-500" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-100 w-full p-6 rounded-2xl">
                            <h1 className="font-semibold">Contact Details</h1>
                            <div className="grid grid-cols-3 gap-2 py-4">
                                <p>Email</p>
                                <h1 className="col-span-2 font-bold">{email || "N/A"}</h1>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <p>Phone Number</p>
                                <h1 className="col-span-2 font-bold">{phone_number || "N/A"}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default ContactProfile;
