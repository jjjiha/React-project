function Detail(props) {

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <img src="https://codingapple1.github.io/shop/shoes1.jpg" width="100%" />
                </div>
                <div className="col-md-6">
                    <h4 className="pt-5">{props.shoes[0].title}</h4>
                    <p>{props.shoes[0].content}</p>
                    <p>{props.shoes[0].price}원</p>
                    <button className="btn btn-danger">주문하기</button>
                </div>
            </div>
        </div>
    )
}
export default Detail;