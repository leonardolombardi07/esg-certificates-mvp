import type {
  CollectionReference,
  DocumentData,
  Firestore,
} from "firebase/firestore";
import { collection } from "firebase/firestore";
import type { CollectionName } from "~/services/firebase/types";
import { getServices } from "~/services/firebase/client/app";
import type { Process } from "~/types";

const { firestore } = getServices();

function getTypedCollection<T = DocumentData>(
  firestore: Firestore,
  name: CollectionName
) {
  return collection(firestore, name) as CollectionReference<T>;
}

function getCollections() {
  const processesCol = getTypedCollection<Process>(firestore, "processes");
  return { processesCol };
}

export { getCollections };
