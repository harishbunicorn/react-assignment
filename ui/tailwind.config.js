/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#004FB4',
                    100: '#4F6C92',
                    200: '#A4B8D3',
                    300: '#CBD2E1',
                    400: '#F1F4F8',
                    500: '#F7F8FB',
                    600: '#2563EB',
                    700: '#1D4ED8',
                    800: '#1E40AF',
                    900: '#1E3A8A',
                },

                secondary: {
                    50: '#EED2DF',
                    100: '#FE93B3',
                    200: '#E2006A',
                    300: '#CAEFD8',
                    400: '#55CB82',
                    500: '#16A64D',
                },
            },
            spacing: {
                128: '32rem',
                411: '103rem',
                572: '35.75rem',
            },

            top: {
                10: '10%',
                100: '100%',
            },

            boxShadow: {
                rangeThumb: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                card: '0px 9px 18px rgba(0, 0, 0, 0.15)',
                nav: 'inset 0px -1px 0px #EAEAEA',
            },
            dropShadow: {
                xs: '0px 2px 2px rgba(0, 0, 0, 0.06)',
            },
        },
    },
    plugins: [],
};
