type SectionHeadingProps = {
  kicker: string;
  title: string;
  description: string;
};

export function SectionHeading({ kicker, title, description }: SectionHeadingProps) {
  return (
    <div>
      <p className="section-kicker">{kicker}</p>
      <h2 className="section-title">{title}</h2>
      <p className="section-description">{description}</p>
    </div>
  );
}
