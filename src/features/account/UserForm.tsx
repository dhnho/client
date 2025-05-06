import agent from "../../lib/api/agent";

export default function UserForm() {

    agent.get('/user').then(response => {
        console.log(response)
    })

    return (
        <div>UserForm</div>
    );
}
