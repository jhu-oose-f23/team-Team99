const COLORS = {
  primary: "#312651",
  secondary: "#444262",
  tertiary: "#FF7754",

  gray: "#83829A",
  gray2: "#C1C0C8",

  white: "#F3F4F8",
  lightWhite: "#FAFAFC",
};

const FONT = {
  regular: "DMRegular",
  medium: "DMMedium",
  bold: "DMBold",
};

const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

export const FONTS = {
  largeTitle: {
    fontFamily: "black",
    fontSize: SIZES.largeTitle,
    lineHeight: 55,
  },
  // h1: { fontFamily: 'bold', fontSize: SIZES.h1, lineHeight: 36 },
  // h2: { fontFamily: 'bold', fontSize: SIZES.h2, lineHeight: 30 },
  // h3: { fontFamily: 'bold', fontSize: SIZES.h3, lineHeight: 22 },
  // h4: { fontFamily: 'bold', fontSize: SIZES.h4, lineHeight: 20 },
  // body1: { fontFamily: 'regular', fontSize: SIZES.body1, lineHeight: 36 },
  // body2: { fontFamily: 'regular', fontSize: SIZES.body2, lineHeight: 30 },
  // body3: { fontFamily: 'regular', fontSize: SIZES.body3, lineHeight: 22 },
  // body4: { fontFamily: 'regular', fontSize: SIZES.body4, lineHeight: 20 },

  // Setting fontFamily results in a console warning so I'm commenting it out for now
  h1: { fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontSize: SIZES.h4, lineHeight: 20 },
  body1: { fontSize: SIZES.body1, lineHeight: 36 },
  body2: { fontSize: SIZES.body2, lineHeight: 30 },
  body3: { fontSize: SIZES.body3, lineHeight: 22 },
  body4: { fontSize: SIZES.body4, lineHeight: 20 },
};

export { COLORS, FONT, SIZES, SHADOWS };
