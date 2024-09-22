import HomeView from "./HomeView";

export default async function HomePage() {
  const data: Category[] = await fetch(
    process.env.BASE_URL + "/api/categories/active"
  ).then((response) => response.json());

  return <HomeView categories={data} />;
}
