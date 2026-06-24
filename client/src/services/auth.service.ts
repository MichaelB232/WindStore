export async function login(data: {
  email: string;
  password: string;
}) {
  console.log("Sevice terpanggil");
  console.log(data);
}

export async function register(data: {
  name:string, 
  email: string;
  password: string;
}) {
  console.log("Sevice terpanggil");
  console.log(data);
}