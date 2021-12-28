module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundColor: theme => ({
        ...theme('colors'),
        'turquoise-500' : '#293AA6',
        'turquoise-400' : '#293AA6',
        'turquoise-300' : '#293AA6',
        'body' : '#EFD89E',
        'post1': "#EFD89E",
        'post2': '#EFD89E',
        'post3': '#EFD89E'
       }),
       textColor : theme => ({
         ...theme('colors'),
         'stone-300'    : '#d6d3d1',
         'fellows' : '#fcfc03'
       }),
       height: {
        '128': '32rem',
      }
    },
    
  },
  variants: {
    extend: {
      colors : {
        'demo': '#42a832'
      }
    },
  },
  plugins: [],
}
