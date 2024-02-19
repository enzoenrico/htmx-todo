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
        console.log(data)
        todoList.pop()

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
                        </li>)
                    : "no tasks found"
            }
        </ul>
    )
}



console.log("Listening on http://localhost:8080")
