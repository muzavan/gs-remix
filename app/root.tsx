import {
    Form,
    Links,
    Meta,
    NavLink,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useNavigation,
    useSubmit
} from "@remix-run/react";

import {ActionFunction, json, LinksFunction, LoaderFunctionArgs, redirect} from "@remix-run/node";
import appStylesHref from "./app.css?url";
import {createEmptyContact, getContacts} from "./data";
import {useEffect} from "react";


export const links: LinksFunction = () => [
    {rel: "stylesheet", href: appStylesHref},
];

export const action: ActionFunction = async () => {
    const contact = await createEmptyContact();
    return redirect(`/contacts/${contact.id}/edit`);
}


export const loader = async ({request}: LoaderFunctionArgs) => {
    const query = new URL(request.url).searchParams.get("q");
    await setTimeout(() => {
    }, 10000)
    const contacts = await getContacts(query);
    return json({contacts, q: query});
}


export default function App() {
    const {contacts, q} = useLoaderData<typeof loader>();
    const navigation = useNavigation();
    const submit = useSubmit();

    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has(
            "q"
        );

    useEffect(() => {
        const searchField = document.getElementById("q");
        if (searchField instanceof HTMLInputElement) {
            searchField.value = q || "";
        }
    }, [q])
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <Meta/>
            <Links/>
        </head>
        <body>
        <div id="sidebar">
            <h1>Remix Contacts </h1>
            <div>
                <Form id="search-form" role="search"
                      onChange={
                          (event) => {
                              const isFirstSearch = q === null;
                              submit(event.currentTarget, {
                                  replace: !isFirstSearch,
                              });

                              submit(event.currentTarget)
                          }
                      }>
                    <input
                        id="q"
                        aria-label="Search contacts"
                        className={searching ? "loading" : ""}
                        placeholder="Search"
                        type="search"
                        name="q"
                        defaultValue={q || ""}
                    />
                    <div id="search-spinner" aria-hidden hidden={!searching}/>
                </Form>
                <Form method="post">
                    <button type="submit">New</button>
                </Form>
            </div>
            <nav>
                {contacts.length ? (
                    <ul>
                        {contacts.map((contact) => (
                            <li key={contact.id}>
                                <NavLink className={({isActive, isPending}) =>
                                    isActive
                                        ? "active"
                                        : isPending
                                            ? "pending"
                                            : ""
                                } to={`contacts/${contact.id}`}>
                                    {contact.first || contact.last ? (
                                        <>
                                            {contact.first} {contact.last}
                                        </>
                                    ) : (
                                        <i>No Name</i>
                                    )}{" "}
                                    {contact.favorite ? (
                                        <span>★</span>
                                    ) : null}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>
                        <i>No contacts</i>
                    </p>
                )}
            </nav>
        </div>

        <div className={
            navigation.state === "loading" && !searching
                ? "loading"
                : ""
        }
             id="detail">
            <Outlet/>
        </div>
        <ScrollRestoration/>
        <Scripts/>
        </body>
        </html>
    );
}