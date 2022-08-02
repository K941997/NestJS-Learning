// Use this function to create string value of enum, for Check constraint in Entity
export const getEnumStr = (enumData: Record<string, any>) => {
  const arrayVals = Object.values(enumData);
  let resultStr = '';
  arrayVals.forEach((val, index) => {
    const lastStr = index === arrayVals.length - 1 ? '' : ', ';
    resultStr = resultStr + `'${val}'` + lastStr;
  });

  return resultStr;
};

// Use this function to get enum value. Use for dto
export const getValEnumNumber = (enumData: Record<string, any>) => {
  return Object.values(enumData).filter((v) => Number.isFinite(v));
};

// Use this function to get enum value. Use for dto
export const getValEnumStr = (enumData: Record<string, any>) => {
  return Object.values(enumData).filter((v) => !Number.isFinite(v));
};
