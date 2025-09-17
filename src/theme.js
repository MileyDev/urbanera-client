import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: 'Quicksand, sans-serif', 
    body: 'Quicksand, sans-serif',    
  },
  colors: {
    brand: {
      500: '#FFD700', 
    },
  },
});

export default theme;