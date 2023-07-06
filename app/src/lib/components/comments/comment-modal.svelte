<script lang="ts">
  import type { SimpleComment } from '$lib/schema/commented';
  import { Modal, ModalContent, ModalHeader } from '../modal';
  import { getModalContext } from '../modal/context';
  import CommentInput from './comment-input.svelte';
  import CommentLoader from './comment-loader.svelte';

  export let snippetId: string;

  const { modalDialog } = getModalContext();

  let newComments: SimpleComment[];

  export let onComment = (newComment: SimpleComment) => {};
</script>

<Modal>
  <ModalHeader>
    <a
      href="/snippet/{snippetId}"
      on:click={() => {
        $modalDialog.close();
      }}
    >
      go to snippet
    </a>
  </ModalHeader>
  <ModalContent>
    <CommentInput
      {snippetId}
      on:comment={({ detail: newComment }) => {
        newComments = [newComment, ...newComments];
        onComment(newComment);
      }}
    />
    <CommentLoader {snippetId} bind:newComments />
  </ModalContent>
  <!-- <ModalFooter /> -->
</Modal>
