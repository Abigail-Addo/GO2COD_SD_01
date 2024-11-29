'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import { MdLightMode, MdDarkMode } from "react-icons/md";

const Toggle = () => {
    const [value, setValue] = React.useState<number>(0); // Slider value (0-100)
    const [, setIsDarkMode] = React.useState(false); // State for dark mode

    // Check the saved preference in localStorage on initial load
    React.useEffect(() => {
        const savedMode = localStorage.getItem('theme');
        if (savedMode === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    // Update theme based on the slider value
    React.useEffect(() => {
        if (value < 50) {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    }, [value]);

    // Handle the slider change
    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number);
    };

    return (
        <Box sx={{ width: 200 }}>
            <Stack spacing={2} direction="row" sx={{ alignItems: 'center', mb: 1 }}>
                <MdLightMode className='text-2xl' />
                <Slider
                    aria-label="Theme slider"
                    value={value}
                    size="small"
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => (value == 0 ? 'Light' : 'Dark')}
                    min={0}
                    max={100}
                    shiftStep={100}
                    step={100}
                    marks
                />
                <MdDarkMode className='text-2xl' />
            </Stack>
        </Box>
    );
}

export default Toggle;
