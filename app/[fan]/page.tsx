import FanContent from "./FanContent";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ fan: string }>;
}

export default async function FanPage({ params }: Props) {
  const { fan } = await params;
  return <FanContent fan={fan} />;
}
