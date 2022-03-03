import { Link } from 'remix';

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome</h1>
      <ul>
        <li>
          <Link to="/posts">My posts</Link>
        </li>
      </ul>
    </div>
  );
}
