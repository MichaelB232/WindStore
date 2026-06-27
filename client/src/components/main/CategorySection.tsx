import Container from "../layout/Container";
import CategoryCard from "./HomeCard";

export default function CategorySection() {
  return (
    <>
      <section id="ShopCategory">
        <Container>
          <div className="mt-10">
            <div className="mb-10">
              <h2 className="text-4xl font-display font-bold">Shop by Category</h2>
            </div>

            {/* <ul className="grid grid-cols-4 mb-6">
              {CategoryDatas.map((cat, idx) => (
                <li className="px-2 mb-10" key={idx}>
                  {<CategoryCard
                  title={cat.name}
                  description={cat.desc}
                  imageUrl={cat.image}
                  />}
                </li>
              ))}
            </ul> */}
          </div>
        </Container>
      </section>
    </>
  );
}
