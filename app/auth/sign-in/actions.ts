"use server";

async function signIn(formData: FormData) {
  const rawFormData = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  // TODO: call server function
}
