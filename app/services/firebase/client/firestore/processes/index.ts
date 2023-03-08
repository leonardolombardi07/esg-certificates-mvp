import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import type { Process, ClientProcess } from "~/types";
import { getCollections } from "../utils";

export const { processesCol } = getCollections();

async function createProcess(form: ClientProcess) {
  const newDoc = doc(processesCol);
  const process: Process = {
    ...form,
    id: newDoc.id,
    status: "pending",
  };
  setDoc(newDoc, process);
  return newDoc.id;
}

async function editProcess(id: string, form: Partial<Process>) {
  setDoc(doc(processesCol, id), form, {
    merge: true,
  });
}

async function getProcess(id: string) {
  const snap = await getDoc(doc(processesCol, id));
  if (!snap.exists()) throw new Error(`Process with id ${id} doesn't exist`);
  return { ...snap.data(), id };
}

async function deleteProcess(id: string) {
  return deleteDoc(doc(processesCol, id));
}

async function getAllProcesses(uid: string) {
  const snap = await getDocs(query(processesCol));
  return snap.docs.map(function getData(doc) {
    return { ...doc.data(), id: doc.id };
  });
}

export {
  getProcess,
  createProcess,
  getAllProcesses,
  deleteProcess,
  editProcess,
};
