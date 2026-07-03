export default function Style2Footer({
  name,
  role,
}: {
  name: string;
  role: string;
}) {
  return (
    <footer className="style2-footer">
      <div className="style2-footer-left">
        {name}
        <span>.</span>
      </div>
      <div className="style2-footer-right">
        © {new Date().getFullYear()} - {role}
      </div>
    </footer>
  );
}
