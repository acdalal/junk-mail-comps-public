/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */


const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    primary: '#324D7F',   
    secondary: '#FABFD7', 
    background: '#CCDFFF',
    surface: '#FFF7F7',
    text: '#0C1630',  
    icon: '#324D7F',    
    buttonBackground: '#324D7F',  
    buttonText: '#FFF7F7', 
    border: '#324D7F',        
    tabIconDefault: '#FFF7F7',
    tabIconSelected: '#FABFD7',
  },
  dark: {
    primary: '#324D7F',   
    secondary: '#FABFD7', 
    background: '#CCDFFF',
    surface: '#FFF7F7',
    text: '#0C1630',  
    icon: '#324D7F',
    buttonBackground: '#324D7F',  
    buttonText: '#FFF7F7', 
    border: '#324D7F',             
    tabIconDefault: '#CCDFFF',
    tabIconSelected: '#FABFD7',
  },
};

export const Styles = {
  filterButton: {
  backgroundColor: "#324D7F",
  paddingVertical: 10,
  paddingHorizontal: 18,
  borderRadius: 20,
  marginRight: 10,
  alignItems: "center",
  justifyContent: "center",
  },
  filterBar: {
  flexDirection: "row",
  paddingHorizontal: 16,
  marginBottom: 10,
  alignItems: "center",
  height: 50,
  },
  selectedFilterButton: {
    backgroundColor: "#1E325C",
  },
  selectedFilterButtonText: {
    color: "#FABFD7",
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF7F7",
  },
  tile: {
    flex: 1,
    backgroundColor: "#FFF7F7",
    margin: 10,
    height: 200,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  itemText: {
    fontSize: 18,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#324D7F",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  addButtonText: {
    color: "#FFF7F7",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  counterButton: {
    backgroundColor: "white",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  counterSymbol: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  counter: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    alignItems: "center",
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  screenTitle: {
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "left",
    paddingTop: 75,
    paddingLeft: 20,
  },
};

export const Fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
};