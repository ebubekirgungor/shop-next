"use client";
import { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import styles from "./page.module.css";
import LayoutContainer from "@/components/layout/LayoutContainer";
import LayoutBox from "@/components/layout/LayoutBox";
import LayoutTitle from "@/components/layout/LayoutTitle";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Dialog from "@/components/ui/Dialog";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Chip from "@/components/ui/Chip";
import { formFetcher, jsonFetcher } from "@/lib/fetchers";
import { toast } from "react-toastify";
import Meta from "@/components/layout/Meta";
import CheckBox from "@/components/ui/CheckBox";

interface Filter {
  name: string;
  value: string;
}

interface ProductImage {
  url: string;
  name: string;
}

interface AdminProduct extends Omit<Product, "images"> {
  category_id?: number;
  category?: { title: string };
  filters: Filter[];
  images: ProductImage[];
}

type DialogType = "product" | "image";

export default function Product({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isAdd = params.id === "create";

  const [product, setProduct] = useState<AdminProduct>();
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
      setProduct((prev) => ({ ...prev!, images: [], filters: [] }));
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
          data.images.map((image: string) => {
            productImagesArray.push({
              url: "/images/products/" + image,
              name: image,
            });
          });
          setProductImages(productImagesArray);
          setLoading(false);
        });
    }
  }, [isAdd, params.id]);

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
    setProduct({
      ...product!,
      [e.target.name]:
        e.target.name === "active" ? e.target.checked : e.target.value,
    });
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

    setProduct({
      ...product!,
      filters:
        category_id === oldProduct?.category_id ? oldProduct.filters : filters,
      category_id,
    });
  }

  function handleFilter(e: ChangeEvent<HTMLInputElement>, index: number) {
    setProduct({
      ...product!,
      filters: product!.filters.map((filter, i) =>
        i === index ? { ...filter, value: e.target.value } : filter
      ),
    });
  }

  const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);

  function handleUploadImage(e: ChangeEvent<HTMLInputElement>) {
    const copy = [...productImages];

    const imagesToUploadCopy = [...imagesToUpload];

    Array.prototype.slice
      .call(
        (
          e.target as {
            files: unknown;
          }
        ).files
      )
      .forEach((file: File) => {
        copy.push({
          url: URL.createObjectURL(file),
          name: file.name,
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
          JSON.stringify(productImages.map((image: ProductImage) => image.name))
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

    const response = await formFetcher(
      `/api/products${!isAdd ? "/" + params.id : ""}`,
      isAdd ? "POST" : "PUT",
      formData
    );

    if (response.status === 200) {
      toast.success(response.message);
      isAdd && router.push("/admin/products");
    } else {
      toast.error(response.message);
    }
  }

  async function deleteProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await jsonFetcher("/api/products/" + params.id, "DELETE");

    if (response.status === 200) {
      toast.success(response.message);
      router.push("/admin/products");
    } else {
      toast.error(response.message);
    }
  }

  async function deleteImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setProductImages([
      ...productImages.slice(0, imageToDelete),
      ...productImages.slice(imageToDelete! + 1),
    ]);

    toast.success("Image deleted");

    closeDialog();
  }

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  function handleSort() {
    const images = [...productImages];
    const draggedItemContent = images.splice(dragItem.current!, 1)[0];
    images.splice(dragOverItem.current!, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setProductImages(images);
  }

  function handleDragStart(position: number) {
    dragItem.current = position;
  }

  function handleDragEnter(position: number) {
    dragOverItem.current = position;
  }

  return (
    <LayoutContainer>
      <LayoutTitle className={styles.layoutTitle}>
        <Link href={"/admin/products"} className={styles.previousButton}>
          <Icon name="previous" />
        </Link>
        <Meta title={isAdd ? "Create Product" : "Edit Product"} />
      </LayoutTitle>
      <LayoutBox minHeight={isAdd ? "400px" : "470px"}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={onSubmit}>
            <div className={styles.formInputsContainer}>
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
                {productImages.map((image, index) => (
                  <div
                    className={styles.imageBox}
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <button
                      type="button"
                      onClick={() => openDialog("image", index)}
                    >
                      <Icon name="delete" disableFilter />
                    </button>
                    <Image
                      className={styles.productImage}
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
            <CheckBox
              label="Active"
              name="active"
              id="active"
              checked={product?.active ?? true}
              onChange={handleProduct}
            />
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
