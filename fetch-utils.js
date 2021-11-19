const SUPABASE_URL = 'https://gxwgjhfyrlwiqakdeamc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjQxMTMxMiwiZXhwIjoxOTUxOTg3MzEyfQ.PHekiwfLxT73qQsLklp0QFEfNx9NlmkssJFDnlvNIcA';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

export async function createTodo(todo){
    const response = await client
        .from('todos')
        .insert({ 
            todo: todo,
            complete: false, 
            user_id: client.auth.user().id, 
        })
        .single();

    return checkError(response);
}

export async function deleteAllTodos() {
    await client
        .from('todos')
        .delete()
        .match({ user_id: client.auth.user().id, });
}

export async function getTodos() {
    const response = await client
        .from('todos')
        .select()
        .order('complete')
        .match({ user_id: client.auth.user().id, });

    return checkError(response);    
}

export async function completeTodo(id) {
    const response = await client
        .from('todos')
        .update({ complete: true })
        .match({ 
            user_id: client.auth.user().id, 
            id: id,
        });

    return checkError(response);    
}



export async function getUser() {
    return client.auth.session();
}


export async function checkAuth() {
    const user = await getUser();

    if (!user) location.replace('../'); 
}

export async function redirectIfLoggedIn() {
    if (await getUser()) {
        location.replace('./todos');
    }
}

export async function signupUser(email, password){
    const response = await client.auth.signUp({ email, password });
    
    return checkError(response);
}

export async function signInUser(email, password){
    const response = await client.auth.signIn({ email, password });

    return checkError(response);
}

export async function logout() {
    await client.auth.signOut();

    return window.location.href = '/';
}

function checkError({ data, error }) {
    return error ? console.error(error) : data;
}