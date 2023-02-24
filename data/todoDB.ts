type dataParameter = {
    email: string,
    _id: string,
    id: string,
    categories: string,
    created: string,
    description: string,
    completed: boolean,
    favorite: boolean,
    date: object,
}[];


const todoDB: dataParameter = [
    {
        _id: "noUser",
        email: "noUser@todo.com",
        id: "12345abcde",
        categories: "Others",
        created: "2022-02-24",
        description: "This is a 'To-Do' test, if you want to enjoy all the features and keep your to-dos you need to log in.",
        completed: false,
        favorite: false,
        date: new Date(),
    },
];


export default todoDB

