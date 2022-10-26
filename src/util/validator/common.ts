export type ValidatorResponse = {
    valid: boolean;
    fields: string[];
}

export const checkProperties = (data: any, props: string[]): ValidatorResponse => {
  return props.reduce<ValidatorResponse>((acc, curr)=> {
    if(!data[curr]){
      acc.valid = false
      acc.fields.push(curr)
    }

    return acc
  }, {
    valid: true,
    fields:[]
  })
}