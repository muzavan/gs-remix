export default function NoIndex() {
    return (
        <p id="index-page">
            This is a demo for Remix.
            <br/>
            Check out{new Date().toISOString()}
            <a href="https://remix.run">the docs at remix.run</a>.
        </p>
    );
}