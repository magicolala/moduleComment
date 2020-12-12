import {render, unmountComponentAtNode} from 'react-dom';
import React, {useEffectn, useState} from 'react';
import {usePaginatedFetch} from "./hooks";
import {Icon} from "../components/Icon";

const dateFormat = {
    dateStyle: 'medium',
    timeStyle: 'short'
}

function Comments({post, user}) {
    const {items: comments, load, loading, count, hasMore} = usePaginatedFetch('/api/comments?post=' + post);

    useEffect(() => {
        load();
    }, []);

    return <div>
        <Title count={count}/>
        {user && <CommentForm post={post}/>}
        {comments.map(comment => <Comment key={comment.id} comment={comment}/>)}
        {hasMore &&
        <button disabled={loading} className="btn btn-primary" onClick={load}>Charger plus de commentaire</button>}
    </div>;
}

const Comment = React.memo(({comment}) => {
    const date = new Date(comment.publishedAt);

    return <div className="row post-comment">
        <h4 className="col-sm-3">
            <strong>{comment.author.username}</strong> commenté le
            <strong>{date.toLocaleString(undefined, dateFormat)}</strong>
        </h4>
        <div className="col-sm-9">
            {comment.content}
        </div>
    </div>;
});

function CommentForm({post}) {
    const [content, setContent] = useState(null);

    return <div className="well">
        <form>
            <fieldset><Icon icon="comment"/> Laisser un commentaire</fieldset>
            <div className="form-group">
                <textarea value={content} name="" id="" cols="30" rows="10" className="form-control"
                          onChange={e => setContent(e.target.value)}></textarea>
                <div className="help-block">Les commentaires non-conformes à notre code de conduite seront modérés.
                </div>
                <div className="form-group">
                    <button className="btn btn-primary">
                        <Icon icon="paper-plane"/>
                        Envoyer
                    </button>
                </div>
            </div>
        </form>
    </div>;
}

function Title({count}) {
    return <h3>
        <Icon icon="comments"/>
        {count} Commentaire{count > 1 ? 's' : ''}
    </h3>
}

class CommentsElement extends HTMLElement {
    connectedCallback() {
        const post = parseInt(this.dataset.post, 10);
        const user = parseInt(this.dataset.user, 10) || null;
        render(<Comments post={post} user={user}/>, this);
    }

    disconnectedCallback() {
        unmountComponentAtNode(this);
    }
}

customElements.define('post-comments', CommentsElement);
