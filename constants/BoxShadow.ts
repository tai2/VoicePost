export const BoxShadow = {
  shadowNone: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  shadow2Xs: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
  },
  shadowXs: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.05,
  },
  shadowSm: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    shadowOpacity: 0.1,
  },
  shadowMd: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
  },
  shadowLg: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 15,
    shadowOpacity: 0.1,
  },
  shadowXl: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 25,
    shadowOpacity: 0.1,
  },
  shadow2Xl: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 25 },
    shadowRadius: 50,
    shadowOpacity: 0.25,
  },
} as const;
