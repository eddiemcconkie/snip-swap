import { componentGroup } from '$lib/helpers/component-group';
import ModalCancelButton from './modal-cancel-button.svelte';
import ModalContent from './modal-content.svelte';
import ModalFooter from './modal-footer.svelte';
import ModalHeader from './modal-header.svelte';
import ModalSubmitButton from './modal-submit-button.svelte';
import Modal_ from './modal.svelte';

export const Modal = componentGroup(Modal_, {
  CancelButton: ModalCancelButton,
  Content: ModalContent,
  Footer: ModalFooter,
  Header: ModalHeader,
  SubmitButton: ModalSubmitButton,
});
