import { renderToString } from "react-dom/server"
const server = Bun.serve({
    hostname: 'localhost',
    port: 8080,
    fetch: apiHandler
})

type Todo = {
    id: number;
    task: string;
}

let todoList: Todo[] = []

async function apiHandler(req: Request): Response {
    const url = new URL(req.url)
    if (url.pathname === "" || url.pathname === "/") {
        return new Response(Bun.file("index.html"))
    }
    if (url.pathname === "/todos" && req.method === "GET") {
        return new Response(renderToString(<TodoList data={todoList} />))
    }
    if (url.pathname === "/todo" && req.method === "POST") {
        const item = await req.formData()
        const task = item.get('task')

        if (!task.length) {
            return new Response(renderToString(<TodoList data={todoList} />))
        } else {

            todoList.push({
                id: task.length + 1,
                task: task
            })
        }
        return new Response(renderToString(<TodoList data={todoList} />))
    }
    if (url.pathname === "/todos" && req.method === "DELETE") {
        const data = await req.formData()
        const dataid = data.get('task')
        console.log(dataid)
        todoList = todoList.filter((val) => {
            return val.task !== dataid
        })


        return new Response(renderToString(<TodoList data={todoList} />), {status: 200})
    }


    return new Response("not found", { status: 404 })
}


function TodoList(props: { data: Todo[] }) {
    return (<ul>

        {
            props.data.length
                ? props.data.map((todo) => <li>{todo.task}
                    <input type="checkbox" name="done" id="done" hx-delete="/todos" />
                    <p id="id">{todo.id}</p>
                </li>)
                : "no tasks found"
        }
    </ul>)
}



console.log("Listening on http://localhost:8080")
