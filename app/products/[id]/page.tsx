
import { products } from "@/data/products";
import ProductDetails from "@/components/ProductDetails";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    return products.map((product) => ({
        id: product.id.toString(),
    }));
}

export default async function ProductPage({ params }: PageProps) {
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id);
    const product = products.find((p) => p.id === productId);

    if (!product) {
        notFound();
    }

    return <ProductDetails product={product} />;
}
