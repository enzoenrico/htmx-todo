import { renderToString } from "react-dom/server"
const server = Bun.serve({
    hostname: 'localhost',
    port: 8080,
    fetch: apiHandler
})

type Todo = {
    id: number;
    task: string;
    bolenado: boolean;
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
                task: task,
                bolenado: false
            })
        }
        return new Response(renderToString(<TodoList data={todoList} />))
    }
    if (url.pathname === "/todos" && req.method === "DELETE") {
        todoList = []
        return new Response(renderToString(<TodoList data={todoList} />), { status: 200 })
    }
    return new Response("not found", { status: 404 })
}


function TodoList(props: { data: Todo[] }) {
    return (
        <ul className="flex items-center flex-col p-2">
            {
                props.data.length
                    ? props.data.map((todo) =>
                        <li className="flex justify-evenly items-center flex-col">
                            <p className="text-lg">{todo.task}</p>

                            <p id="id" className="text-sm text-slate-700">{todo.id}</p>
                            <input type="checkbox" name="bolenado" id="bolenado" defaultChecked={todo.bolenado} />
                        </li>)
                    : "no tasks found"
            }
        </ul>
    )
}



console.log("Listening on http://localhost:8080")
