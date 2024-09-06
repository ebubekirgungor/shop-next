"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import styles from "./page.module.css";
import LayoutContainer from "@/components/layout/LayoutContainer";
import LayoutBox from "@/components/layout/LayoutBox";
import LayoutTitle from "@/components/layout/LayoutTitle";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Image from "next/image";
import { formFetcher } from "@/lib/fetchers";
import { toast } from "react-toastify";

type DialogType = "POST" | "PUT" | "DELETE";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setLoading] = useState(true);

  async function getAllCategories() {
    await fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      });
  }

  useEffect(() => {
    getAllCategories();
  }, []);

  const [dialogType, setDialogType] = useState<DialogType>();
  const [dialog, setDialog] = useState(false);
  const [dialogStatus, setDialogStatus] = useState(false);

  function openDialog(type: DialogType, category: Category) {
    setDialogType(type);
    setNewCategory({ ...category });
    setDialogStatus(true);
    setDialog(true);
  }

  function closeDialog() {
    setDialogStatus(false);
    setTimeout(() => setDialog(false), 300);
  }

  const [newCategory, setNewCategory] = useState<Category>();

  const [newFilter, setNewFilter] = useState("");

  function handleNewFilter() {
    setNewCategory({
      ...newCategory!,
      filters: [...newCategory?.filters!, newFilter],
    });
    setNewFilter("");
  }

  function deleteFilter(index: number) {
    setNewCategory({
      ...newCategory!,
      filters: [
        ...newCategory?.filters.slice(0, index)!,
        ...newCategory?.filters.slice(index + 1)!,
      ],
    });
  }

  const [newImage, setNewImage] = useState<File>();

  function handleNewImage(e: ChangeEvent<HTMLInputElement>) {
    setNewImage(e.target.files![0]);
    setNewCategory({
      ...newCategory!,
      image: URL.createObjectURL(e.target.files![0]),
    });
  }

  function deleteNewImage() {
    setNewCategory({
      ...newCategory!,
      image: "",
    });
  }

  function handleNewCategory(e: ChangeEvent<HTMLInputElement>) {
    setNewCategory({
      ...newCategory!,
      [e.target.name]: e.target.value,
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("id", (newCategory?.id || 0).toString());
    formData.append("title", newCategory?.title!);
    formData.append("filters", JSON.stringify(newCategory?.filters));
    if (newImage) formData.append("image", newImage!);

    const response = await formFetcher(
      "/api/categories",
      dialogType!,
      formData
    );

    closeDialog();

    if (response.status === 200) {
      switch (dialogType) {
        case "POST":
          setCategories((prev) => [...prev, response.body]);
          break;
        case "PUT":
          setCategories((prev) =>
            prev.map((category) => {
              return category.id === newCategory?.id ? newCategory! : category;
            })
          );
          break;
        case "DELETE":
          setCategories((prev) =>
            prev.filter((category) => category.id !== newCategory?.id)
          );
          break;
      }
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  }

  return (
    <LayoutContainer>
      <LayoutTitle>Categories</LayoutTitle>
      <LayoutBox minHeight="338px" className={styles.layoutBox}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className={styles.row}>
            <button
              className={styles.addBox}
              onClick={() =>
                openDialog("POST", {
                  id: undefined,
                  title: "",
                  url: "",
                  filters: [],
                  image: "",
                })
              }
            />
            {categories &&
              categories.map((category) => (
                <div className={styles.categoryBox} key={category.id}>
                  <div className={styles.actions}>
                    <button
                      className={styles.button}
                      onClick={() => openDialog("PUT", category)}
                    >
                      <Icon name="edit" disableFilter />
                    </button>
                    <button
                      className={styles.button}
                      onClick={() => openDialog("DELETE", category)}
                    >
                      <Icon name="delete" disableFilter />
                    </button>
                  </div>
                  <Image
                    src={category.image!}
                    alt={category.image!}
                    width="0"
                    height="0"
                    sizes="14rem"
                  />
                  <div className={styles.title}>{category.title}</div>
                </div>
              ))}
          </div>
        )}
        {dialog && (
          <Dialog
            title={
              {
                POST: "Add new category",
                PUT: "Edit category",
                DELETE: "Delete category",
              }[dialogType!]
            }
            close={closeDialog}
            status={dialogStatus}
          >
            <form onSubmit={onSubmit}>
              {dialogType != "DELETE" ? (
                <>
                  <Input
                    label="Title"
                    type="text"
                    name="title"
                    value={newCategory?.title}
                    required
                    onChange={handleNewCategory}
                  />
                  <div className={styles.filtersContainer}>
                    <Input
                      label="Filters"
                      type="text"
                      name="newfilter"
                      value={newFilter}
                      onChange={(e) => setNewFilter(e.target.value)}
                    />
                    <button
                      className={styles.addFilterButton}
                      type="button"
                      onClick={handleNewFilter}
                      disabled={!newFilter}
                    >
                      Add
                    </button>
                  </div>
                  <div className={styles.filtersRow}>
                    {newCategory?.filters &&
                      newCategory.filters.map((filter, index) => (
                        <div className={styles.filter} key={index}>
                          {filter}
                          <button
                            onClick={() => deleteFilter(index)}
                            type="button"
                          >
                            <Icon name="close" />
                          </button>
                        </div>
                      ))}
                  </div>
                  {newCategory?.image ? (
                    <div className={styles.newImage}>
                      <div className={styles.actions}>
                        <button
                          className={styles.button}
                          type="button"
                          onClick={deleteNewImage}
                        >
                          <Icon name="delete" disableFilter />
                        </button>
                      </div>
                      <Image
                        src={newCategory.image}
                        alt="New image"
                        width="0"
                        height="0"
                        sizes="14rem"
                      />
                    </div>
                  ) : (
                    <label className={styles.uploadImageBox}>
                      <input
                        style={{ display: "none" }}
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleNewImage}
                      />
                      <div className={styles.uploadIcon} />
                      Click to upload
                    </label>
                  )}
                </>
              ) : (
                <div style={{ textAlign: "center" }}>Are you sure?</div>
              )}
              <Button disabled={!newCategory?.title}>
                {
                  {
                    POST: "Create",
                    PUT: "Update",
                    DELETE: "Delete",
                  }[dialogType!]
                }
              </Button>
            </form>
          </Dialog>
        )}
      </LayoutBox>
    </LayoutContainer>
  );
}
