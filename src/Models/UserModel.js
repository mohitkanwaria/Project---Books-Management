/*
{ 
    title: {string, mandatory, enum[Mr, Mrs, Miss]},
    name: {string, mandatory},
    phone: {string, mandatory, unique},
    email: {string, mandatory, valid email, unique}, 
    password: {string, mandatory, minLen 8, maxLen 15},
    address: {
      street: {string},
      city: {string},
      pincode: {string}
    },
    createdAt: {timestamp},
    updatedAt: {timestamp}
  }
  */