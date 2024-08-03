"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import styles from "./page.module.css";
import LayoutContainer from "@/components/LayoutContainer";
import LayoutBox from "@/components/LayoutBox";
import LayoutTitle from "@/components/LayoutTitle";
import LoadingSpinner from "@/components/LoadingSpinner";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Select from "@/components/Select";
import Link from "next/link";
import Icon from "@/components/Icon";
import Dialog from "@/components/Dialog";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Chip from "@/components/Chip";

interface Category {
  id: number | null;
  title: string;
  filters: string[];
}

interface Filter {
  name: string;
  value: string;
}

interface ProductImage {
  url: string;
  name: string;
  order: number;
}

interface EventTarget {
  files: unknown;
}

interface Product {
  id?: number | null;
  title?: string;
  url?: string;
  category_id?: number;
  category?: { title: string };
  list_price?: number;
  stock_quantity?: number;
  filters: Filter[];
  images: ProductImage[];
}

export default function Product({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isAdd = params.id === "create";

  const [product, setProduct] = useState<Product>();
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setLoading] = useState(!isAdd);

  const [oldProduct, setOldProduct] = useState<{
    category_id: number;
    filters: Filter[];
  }>();

  useEffect(() => {
    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      });

    if (isAdd) {
      setProduct({ images: [], filters: [] });
    } else {
      fetch("/api/products/" + params.id)
        .then((response) => response.json())
        .then((data) => {
          setOldProduct({
            category_id: data.category_id,
            filters: data.filters,
          });
          setProduct(data);
          const productImagesArray: ProductImage[] = [];
          data.images.map((image: ProductImage) => {
            productImagesArray.push({
              url: "/images/products/" + image.name,
              name: image.name,
              order: image.order,
            });
          });
          setProductImages(productImagesArray);
          setLoading(false);
        });
    }
  }, []);

  type DialogType = "product" | "image";

  const [dialogType, setDialogType] = useState<DialogType>();
  const [dialog, setDialog] = useState(false);
  const [dialogStatus, setDialogStatus] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<number>();

  function openDialog(type: DialogType, image?: number) {
    setDialogType(type);
    setImageToDelete(image);
    setDialogStatus(true);
    setDialog(true);
  }

  function closeDialog() {
    setDialogStatus(false);
    setTimeout(() => setDialog(false), 300);
  }

  function handleProduct(e: ChangeEvent<HTMLInputElement>) {
    const copy = { ...product } as any;
    copy[e.target.name] = e.target.value;
    setProduct(copy);
  }

  function handleCategory(e: ChangeEvent<HTMLSelectElement>) {
    const category_id = Number(e.target.value);
    const filters: Filter[] = [];

    categories
      .find((category) => category.id === category_id)
      ?.filters.map((filter: string) =>
        filters.push({
          name: filter,
          value: "",
        })
      );

    setProduct((prevState) => ({
      ...prevState!,
      filters:
        category_id === oldProduct?.category_id ? oldProduct.filters : filters,
      category_id,
    }));
  }

  function handleFilter(e: ChangeEvent<HTMLInputElement>, index: number) {
    const copy = { ...product } as any;
    copy["filters"][index].value = e.target.value;
    setProduct(copy);
  }

  const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);

  function handleUploadImage(e: ChangeEvent<HTMLInputElement>) {
    const copy = [...productImages];

    const imagesToUploadCopy = [...imagesToUpload];

    Array.prototype.slice
      .call((e.target as EventTarget).files)
      .forEach((file: File) => {
        copy.push({
          url: URL.createObjectURL(file),
          name: file.name,
          order: copy.length,
        });
        imagesToUploadCopy.push(file);
      });

    setImagesToUpload(imagesToUploadCopy);
    setProductImages(copy);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData();

    for (const item in product) {
      if (item == "filters") {
        formData.append("filters", JSON.stringify(product.filters));
      } else if (item == "images") {
        formData.append(
          "images",
          JSON.stringify(
            productImages.map(({ url, ...rest }: ProductImage) => rest)
          )
        );
      } else {
        formData.append(
          item,
          (product as unknown as { [key: string]: string })[item]
        );
      }
    }

    for (const image in imagesToUpload) {
      formData.append("files", imagesToUpload[image]);
    }

    await fetch(`/api/products${!isAdd ? "/" + params.id : ""}`, {
      method: isAdd ? "POST" : "PUT",
      body: formData,
    });
  }

  async function deleteProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch("/api/products/" + params.id, {
      method: "DELETE",
    });

    if (response.status == 200) {
      router.push("/admin/products");
    }
  }

  async function deleteImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const copy = [...productImages];

    copy.splice(
      copy.map((image: ProductImage) => image.order).indexOf(imageToDelete!),
      1
    );

    for (let i = 0; i < copy.length; i++) {
      copy[i].order = i;
    }

    setProductImages(copy);
    closeDialog();
  }

  return (
    <LayoutContainer>
      <LayoutTitle style={{ paddingLeft: "1rem" }}>
        <Link href={"/admin/products"} className={styles.previousButton}>
          <Icon name="previous" />
        </Link>
        {isAdd ? "Create Product" : "Edit Product"}
      </LayoutTitle>
      <LayoutBox minHeight={isAdd ? "400px" : "470px"}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={onSubmit}>
            <div className={styles.grid}>
              <Input
                label="Title"
                type="text"
                name="title"
                value={product?.title ?? ""}
                onChange={handleProduct}
              />
              <Input
                label="List price"
                step=".01"
                type="number"
                min="1"
                name="list_price"
                value={product?.list_price ?? ""}
                onChange={handleProduct}
              />
              <Input
                label="Stock quantity"
                type="number"
                min="0"
                name="stock_quantity"
                value={product?.stock_quantity ?? ""}
                onChange={handleProduct}
              />
              <Select
                label="Category"
                value={product?.category_id ?? 0}
                onChange={handleCategory}
              >
                <option value={0}>Select category</option>
                {categories.map((category) => (
                  <option value={category.id?.toString()} key={category.id}>
                    {category.title}
                  </option>
                ))}
              </Select>
              {product?.filters &&
                product?.filters.map((filter, index) => (
                  <Input
                    label={filter.name}
                    key={index}
                    value={filter.value}
                    onChange={(e) => handleFilter(e, index)}
                  />
                ))}
            </div>
            <div className={styles.column}>
              <div className={styles.imagesLabel}>
                Images
                <label>
                  <input
                    style={{ display: "none" }}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    multiple
                    onChange={handleUploadImage}
                  />
                  <Chip>Upload</Chip>
                </label>
              </div>
              <div className={styles.imagesContainer}>
                {productImages.map((image) => (
                  <div className={styles.imageBox} key={image.order}>
                    <button
                      type="button"
                      onClick={() => openDialog("image", image.order)}
                    >
                      <Icon name="delete" />
                    </button>
                    <Image
                      src={image.url}
                      alt={image.url}
                      width="0"
                      height="0"
                      sizes="11rem"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.column}>
              <Button>{isAdd ? "Create" : "Update"}</Button>
              {!isAdd && (
                <Button
                  className={styles.deleteButton}
                  type="button"
                  onClick={() => openDialog("product")}
                >
                  Delete
                </Button>
              )}
            </div>
          </form>
        )}
        {dialog && (
          <Dialog
            title={`Delete ${dialogType}`}
            close={closeDialog}
            status={dialogStatus}
          >
            <form
              onSubmit={dialogType === "product" ? deleteProduct : deleteImage}
            >
              <div style={{ textAlign: "center" }}>Are you sure?</div>
              <Button>Delete</Button>
            </form>
          </Dialog>
        )}
      </LayoutBox>
    </LayoutContainer>
  );
}
