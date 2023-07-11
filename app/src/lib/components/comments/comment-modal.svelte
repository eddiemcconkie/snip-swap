<script lang="ts">
  import type { SimpleComment } from '@snipswap/schema';
  import { Modal } from '../modal';
  import { getModalContext } from '../modal/context';
  import CommentInput from './comment-input.svelte';
  import CommentLoader from './comment-loader.svelte';

  export let snippetId: string;

  const { modalDialog } = getModalContext();

  let newComments: SimpleComment[];

  export let onComment = (newComment: SimpleComment) => {};
</script>

<Modal>
  <Modal.Header>
    <a
      href="/snippet/{snippetId}"
      on:click={() => {
        $modalDialog.close();
      }}
    >
      go to snippet
    </a>
  </Modal.Header>
  <Modal.Content>
    <CommentInput
      {snippetId}
      on:comment={({ detail: newComment }) => {
        newComments = [newComment, ...newComments];
        onComment(newComment);
      }}
    />
    <CommentLoader {snippetId} bind:newComments />
  </Modal.Content>
  <!-- <ModalFooter /> -->
</Modal>
