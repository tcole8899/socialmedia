import React from 'react';

class Post extends React.Component {
    render() {
        return (
            <div className="Post">
                <div className="Post-author">
                    <h5>@{this.props.author}</h5>
                </div>
                <div className="Post-text">
                    <p>{this.props.text}</p>
                </div>
            </div>
        );
    }
}

export default Post