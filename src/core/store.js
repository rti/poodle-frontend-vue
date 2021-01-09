const store = {
  debug: true,

  state: {
    value: undefined,
  },

  setValue(value){
    if(this.debug){
      console.log('setValue ', value);
    }

    this.value = value;
  }
}

export default store;

