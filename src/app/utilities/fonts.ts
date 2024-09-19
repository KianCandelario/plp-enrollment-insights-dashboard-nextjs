import { Quicksand, Poppins } from "next/font/google";

export const quicksand = Quicksand({
    subsets: ['latin'],
    weight: ['300', '500'],
    style: ['normal'],
    display: 'swap',
})

export const poppins = Poppins({
    subsets: ['latin'],
    weight: ['200', '500'],
    style: ['normal', 'italic'],
    display: 'swap',
})