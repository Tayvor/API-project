import './DeleteReviewModal.css'

export default function DeleteReviewModal() {
  return (
    <>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this review?</p>
      <button className="redBtn">Yes (Delete Review)</button>
      <button className="greyBtn">No (Keep Review)</button>
    </>
  )
}
