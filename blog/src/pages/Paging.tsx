import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Paging.module.css"; // 상대 경로로 수정
import React from "react";

interface Props {
  totalItems: number;
  itemCountPerPage: number;
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void; // 페이지 변경 이벤트 추가
}

export default function Pagination({ totalItems, itemCountPerPage, pageCount, currentPage, onPageChange }: Props) {
  const totalPages = Math.ceil(totalItems / itemCountPerPage);
  const [start, setStart] = useState(1);
  const noPrev = start === 1;
  const noNext = start + pageCount - 1 >= totalPages;

  useEffect(() => {
    if (currentPage === start + pageCount) setStart((prev) => prev + pageCount);
    if (currentPage < start) setStart((prev) => prev - pageCount);
  }, [currentPage, pageCount, start]);

  return (
    <div className={styles.wrapper}>
      <ul>
        <li className={`${styles.move} ${noPrev && styles.invisible}`}>
          <Link to={`?page=${start - 1}`}>이전</Link>
        </li>
        {[...Array(pageCount)].map((_, i) => (
          start + i <= totalPages && (
            <li key={start + i}>
              <Link
                className={`${styles.page} ${currentPage === start + i && styles.active}`}
                to={`?page=${start + i}`}
                onClick={() => onPageChange(start + i)} // 페이지 변경 이벤트 추가
              >
                {start + i}
              </Link>
            </li>
          )
        ))}
        <li className={`${styles.move} ${noNext && styles.invisible}`}>
          <Link to={`?page=${start + pageCount}`} onClick={() => onPageChange(start + pageCount)}>다음</Link>
        </li>
      </ul>
    </div>
  );
}
