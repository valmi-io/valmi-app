// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { alpha, lighten, darken } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import '@mui/lab/themeAugmentation';
import { Poppins } from 'next/font/google';

const primaryColor = '#E55837';
const secondaryColor = '#2A9D90';
const successColor = '#2E7D32';
const warningColor = '#EF6C00';
const errorColor = '#D32F2F';
const infoColor = '#0288D1';
export const blackColor = '#000000';
const whiteColor = '#FFFFFF';

const elevationOutlinedColor = '#E0E0E0';

const _lightBg1 = whiteColor; //'#f7f8fc';
const _lightBg2 = '#edeef2';

const themeColors = {
  primary: primaryColor,
  secondary: secondaryColor,
  success: successColor,
  warning: warningColor,
  error: errorColor,
  info: infoColor,
  info: _lightBg2,
  black: blackColor,
  white: whiteColor,
  primaryAlt: '#000C57',
  elevation: elevationOutlinedColor
};

/**
 * Poppins - Google font
 */
const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica',
    'Arial',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji'
  ]
});

const colors = {
  layout: {
    general: {
      bodyBg: _lightBg1 //_lightBg3
    },
    sidebar: {
      background: themeColors.black,
      textColor: themeColors.secondary,
      dividerBg: '#f2f5f9',
      menuItemColor: '#242E6F',
      menuItemColorActive: themeColors.primary,
      menuItemBg: themeColors.white,
      menuItemBgActive: '#f2f5f9',
      menuItemIconColor: lighten(themeColors.secondary, 0.3),
      menuItemIconColorActive: themeColors.primary,
      menuItemHeadingColor: darken(themeColors.secondary, 0.3)
    }
  },
  alpha: {
    white: {
      5: alpha(themeColors.white, 0.02),
      10: alpha(themeColors.white, 0.1),
      30: alpha(themeColors.white, 0.3),
      50: alpha(themeColors.white, 0.5),
      70: alpha(themeColors.white, 0.7),
      100: themeColors.white
    },
    trueWhite: {
      5: alpha(themeColors.white, 0.02),
      10: alpha(themeColors.white, 0.1),
      30: alpha(themeColors.white, 0.3),
      50: alpha(themeColors.white, 0.5),
      70: alpha(themeColors.white, 0.7),
      100: themeColors.white
    },
    black: {
      1: alpha(themeColors.black, 0.03),
      5: alpha(themeColors.black, 0.05),
      10: alpha(themeColors.black, 0.1),
      30: alpha(themeColors.black, 0.3),
      50: alpha(themeColors.black, 0.5),
      70: alpha(themeColors.black, 0.7),
      100: themeColors.black
    }
  },
  secondary: {
    light: '#5ABBB2',
    dark: '#237F72',
    main: themeColors.secondary,
    contrast: themeColors.white
  },
  primary: {
    light: '#E76F51',
    dark: '#DA5233',
    main: themeColors.primary,
    contrast: themeColors.white
  },
  success: {
    light: '#4CAF50',
    dark: '#1B5E20',
    main: themeColors.success,
    contrast: themeColors.white
  },
  warning: {
    light: '#FF9800',
    dark: '#E65100',
    main: themeColors.warning,
    contrast: themeColors.white
  },
  error: {
    light: '#EF5350',
    main: themeColors.error,
    dark: '#C62828'
  },
  info: {
    light: '#03A9F4',
    dark: '#01579B',
    main: themeColors.info,
    contrast: themeColors.white
  },
  elevation: elevationOutlinedColor
};

export const AppFlowyTheme = createTheme({
  colors: {
    alpha: {
      white: {
        5: alpha(themeColors.white, 0.02),
        10: alpha(themeColors.white, 0.1),
        30: alpha(themeColors.white, 0.3),
        50: alpha(themeColors.white, 0.5),
        70: alpha(themeColors.white, 0.7),
        100: themeColors.white
      },
      trueWhite: {
        5: alpha(themeColors.white, 0.02),
        10: alpha(themeColors.white, 0.1),
        30: alpha(themeColors.white, 0.3),
        50: alpha(themeColors.white, 0.5),
        70: alpha(themeColors.white, 0.7),
        100: themeColors.white
      },
      black: {
        1: alpha(themeColors.black, 0.03),
        5: alpha(themeColors.black, 0.05),
        10: alpha(themeColors.black, 0.1),
        30: alpha(themeColors.black, 0.3),
        50: alpha(themeColors.black, 0.5),
        70: alpha(themeColors.black, 0.7),
        100: themeColors.black
      }
    },
    secondary: {
      lighter: alpha(themeColors.secondary, 0.1),
      light: lighten(themeColors.secondary, 0.3),
      main: themeColors.secondary,
      dark: darken(themeColors.secondary, 0.2)
    },
    primary: {
      lighter: alpha(themeColors.primary, 0.1),
      light: lighten(themeColors.primary, 0.3),
      main: themeColors.primary,
      dark: darken(themeColors.primary, 0.8)
    },
    success: {
      lighter: alpha(themeColors.success, 0.1),
      light: lighten(themeColors.success, 0.3),
      main: themeColors.success,
      dark: darken(themeColors.success, 0.2)
    },
    warning: {
      lighter: alpha(themeColors.warning, 0.1),
      light: lighten(themeColors.warning, 0.3),
      main: themeColors.warning,
      dark: darken(themeColors.warning, 0.2)
    },
    error: {
      lighter: alpha(themeColors.error, 0.1),
      light: lighten(themeColors.error, 0.3),
      main: themeColors.error,
      dark: darken(themeColors.error, 0.2)
    },
    info: {
      lighter: alpha(themeColors.info, 0.1),
      light: lighten(themeColors.info, 0.3),
      main: themeColors.info,
      dark: darken(themeColors.info, 0.2)
    }
  },
  general: {
    reactFrameworkColor: '#00D8FF',
    borderRadiusSm: '6px',
    borderRadius: '10px',
    borderRadiusLg: '12px',
    borderRadiusXl: '16px'
  },
  sidebar: {
    background: colors.layout.sidebar.background,
    textColor: colors.layout.sidebar.textColor,
    dividerBg: colors.layout.sidebar.dividerBg,
    menuItemColor: colors.layout.sidebar.menuItemColor,
    menuItemColorActive: colors.layout.sidebar.menuItemColorActive,
    menuItemBg: colors.layout.sidebar.menuItemBg,
    menuItemBgActive: colors.layout.sidebar.menuItemBgActive,
    menuItemIconColor: colors.layout.sidebar.menuItemIconColor,
    menuItemIconColorActive: colors.layout.sidebar.menuItemIconColorActive,
    menuItemHeadingColor: colors.layout.sidebar.menuItemHeadingColor,
    boxShadow: '2px 0 3px rgba(159, 162, 191, .18), 1px 0 1px rgba(159, 162, 191, 0.32)',
    width: '248px'
  },
  header: {
    height: '64px',
    background: colors.alpha.white[100],
    textColor: colors.secondary.main
  },
  // default spacing is 8px.
  spacing: 8,

  palette: {
    common: {
      black: colors.alpha.black[100],
      white: colors.alpha.white[100]
    },
    mode: 'light',
    primary: {
      light: colors.primary.light,
      main: colors.primary.main,
      dark: colors.primary.dark
    },
    secondary: {
      light: colors.secondary.light,
      main: colors.secondary.main,
      dark: colors.secondary.dark
    },
    error: {
      light: colors.error.light,
      main: colors.error.main,
      dark: colors.error.dark,
      contrastText: colors.alpha.white[100]
    },
    success: {
      light: colors.success.light,
      main: colors.success.main,
      dark: colors.success.dark,
      contrastText: colors.alpha.white[100]
    },
    info: {
      light: colors.info.light,
      main: colors.info.main,
      dark: colors.info.dark,
      contrastText: colors.alpha.white[100]
    },
    warning: {
      light: colors.warning.light,
      main: colors.warning.main,
      dark: colors.warning.dark,
      contrastText: colors.alpha.white[100]
    },
    text: {
      primary: '#666666',
      secondary: '#999999',
      disabled: '#e6e6e6'
    },
    divider: '#616161',

    background: {
      paper: colors.alpha.white[100],
      default: colors.layout.general.bodyBg
    },
    action: {
      active: 'rgba(0, 0, 0, 0.56)',
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      focus: 'rgba(0, 0, 0, 0.12)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)'
    },
    tonalOffset: 0.5
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1440
    }
  },
  components: {
    //modifies root layout
    MuiCssBaseline: {
      styleOverrides: {
        '.black-bg': {
          // color: colors.alpha.black[100]
        },
        '.custom-class': {
          backgroundColor: 'orange'
        },
        'html, body': {
          width: '100%',
          height: '100%'
        },
        body: {
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%',
          flex: 1
        },
        '#__next': {
          width: '100%',
          display: 'flex',
          flex: 1,
          flexDirection: 'column'
        },
        html: {
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%',
          MozOsxFontSmoothing: 'grayscale',
          WebkitFontSmoothing: 'antialiased'
        },
        '.child-popover .MuiPaper-root .MuiList-root': {
          flexDirection: 'column'
        },
        '#nprogress': {
          pointerEvents: 'none'
        },
        '#nprogress .bar': {
          background: colors.primary.lighter
        },
        '#nprogress .spinner-icon': {
          borderTopColor: colors.primary.lighter,
          borderLeftColor: colors.primary.lighter
        },
        '#nprogress .peg': {
          boxShadow: '0 0 15px ' + colors.primary.lighter + ', 0 0 8px' + colors.primary.light
        },
        ':root': {
          '--swiper-theme-color': colors.primary.main
        },
        code: {
          background: colors.info.lighter,
          color: colors.info.dark,
          borderRadius: 4,
          padding: 4
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: 0,
          borderRadius: 0
        },
        elevation0: {
          boxShadow: 'none'
        },
        elevation: {
          boxShadow: 'none'
        },
        elevation2: {
          // boxShadow: colors.shadows.cardSm
        },
        elevation24: {
          // boxShadow: colors.shadows.cardLg
        },
        outlined: {
          border: `1px solid ${themeColors.elevation}`
        }
      }
    },
    MuiContainer: {
      defaultProps: {
        disableGutters: true
      },
      styleOverrides: {
        root: {
          paddingRight: '0px',
          paddingLeft: '0px'
        }
      }
    },
    //modifies button
    MuiButton: {
      defaultProps: {
        disableRipple: true
      },
      styleOverrides: {
        root: {
          textTransform: 'none'
        },

        sizeSmall: {
          fontWeight: 500,
          lineHeight: 1.7,
          borderRadius: 0
        }
      }
    },

    // modifies hover and transition behaviour, without this when hovered table cell highlights in black color
    MuiTableRow: {
      styleOverrides: {
        head: {
          background: colors.alpha.black[5]
        },
        root: {
          transition: 'background-color .2s',

          '&.MuiTableRow-hover:hover': {
            backgroundColor: colors.alpha.black[5]
          }
        }
      }
    },
    //modifies table headings into uppercase and bold
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: colors.alpha.black[10],
          fontSize: 14
        },
        head: {
          textTransform: 'uppercase',
          fontSize: 13,
          fontWeight: 'bold',
          color: colors.alpha.black[70]
        }
      }
    },
    //modifies list item
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '& .MuiTouchRipple-root': {
            opacity: 0.3
          },
          '&:hover': {
            backgroundColor: alpha(colors.alpha.trueWhite[100], 0.04)
          },
          '&:active, &.active, &.Mui-selected': {
            color: colors.primary.main
          }
        }
      }
    },
    //modifies form helper text
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    }
  },
  shape: {
    borderRadius: 4
  },
  typography: {
    fontFamily: poppins.style.fontFamily,
    h1: {
      fontWeight: 300,
      fontSize: '96px',
      lineHeight: 1.167,
      letterSpacing: '-1px'
    },
    h2: {
      fontWeight: 300,
      fontSize: '60px',
      lineHeight: 1.2,
      letterSpacing: '-0.5px'
    },
    h3: {
      fontWeight: 400,
      fontSize: '48px',
      lineHeight: 1.167,
      letterSpacing: '0',
      color: colors.alpha.black[100]
    },
    h4: {
      fontWeight: 400,
      fontSize: '34px',
      lineHeight: 1.235,
      letterSpacing: '0.5px'
    },
    h5: {
      fontWeight: 400,
      fontSize: '24px',
      lineHeight: 1.334,
      letterSpacing: '0'
    },
    h6: {
      fontWeight: 500,
      fontSize: '20px',
      lineHeight: 1.6,
      letterSpacing: '0.15px',
      color: colors.alpha.black[100]
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: 1.75,
      letterSpacing: '0.5px',
      color: colors.alpha.black[100]
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: 1.57,
      letterSpacing: '0.25px',
      color: colors.alpha.black[100]
    },
    body1: {
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: 1.5,
      letterSpacing: '0.15px',
      color: colors.alpha.black[100]
    },
    body2: {
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: 1.43,
      letterSpacing: '0.75px'
    },
    button: {
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: 1.75,
      letterSpacing: '0.4px',
      textTransform: 'uppercase'
    },
    caption: {
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: 1.67,
      letterSpacing: '0.4px',
      color: colors.alpha.black[100]
    },
    overline: {
      fontWeight: 400,
      fontSize: '10px',
      lineHeight: 2.66,
      letterSpacing: '2px',
      textTransform: 'uppercase'
    }
  }
});
