import supabase from "./supabase.js";

export async function getUsers() {

    let { data: users, error } = await supabase
        .from('users')
        .select('*')

    return users;
}