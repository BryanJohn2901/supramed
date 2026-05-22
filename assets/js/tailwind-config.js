tailwind.config = {
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#3D3D47',
                    navy: '#555561',
                    light: '#F5F5F8',
                    teal: '#33A8A6',
                    tealHover: '#2E9896',
                    tealLight: '#85DEC4'
                },
                saude: { light: '#85DEC4', dark: '#33A8A6' },
                vida: { light: '#FFAB9C', dark: '#FF6C89' },
                qualidade: { light: '#75A8F8', dark: '#7B4DF5' },
                neutral: { light: '#C6C6D1', dark: '#3D3D47' },
                sec: {
                    yellow: '#FCEE5D',
                    orange: '#EFA24A',
                    red: '#FF5D5D',
                    green: '#70D79A',
                    blue: '#3B6BFF',
                    purple: '#5B00B2'
                },
                palette: {
                    50: '#FFFFFF',
                    100: '#D9D9E3',
                    200: '#A9A9B3',
                    300: '#7B7B87',
                    400: '#555561',
                    500: '#3D3D47'
                }
            },
            backgroundImage: {
                'gradient-saude': 'linear-gradient(90deg, #85DEC4 0%, #33A8A6 100%)',
                'gradient-vida': 'linear-gradient(90deg, #FFAB9C 0%, #FF6C89 100%)',
                'gradient-qualidade': 'linear-gradient(90deg, #75A8F8 0%, #7B4DF5 100%)',
                'gradient-neutral': 'linear-gradient(90deg, #C6C6D1 0%, #3D3D47 100%)'
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Inter', 'sans-serif'],
                display: ['Inter', 'sans-serif']
            }
        }
    }
};
