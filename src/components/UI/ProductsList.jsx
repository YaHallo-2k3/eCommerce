import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";

const ProductsList = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(8);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPost = data.slice(firstPostIndex, lastPostIndex);
  return (
    <>
      {currentPost.map((item, index) => (
        <ProductCard key={index} item={item} />
      ))}
      <Pagination
        totalPosts={data.length}
        postsPerPage={postsPerPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default ProductsList;
