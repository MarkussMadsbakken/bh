import { iconComponentFor$, imagePlugin, InsertImage, readOnly$, RealmPlugin, TooltipWrap, useCellValues, useTranslation } from "@mdxeditor/editor";
import { forwardRef, useState } from "react";
import { Button } from "../input";
import Modal, { ModalTab } from "../modal";
import { ImageUpload } from "../imageUpload";


export const CustomInsertImage = forwardRef((props, ref) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [readOnly, iconComponentFor] = useCellValues(readOnly$, iconComponentFor$);
    const translation = useTranslation();

    return (
        <>
            <button onClick={() => setModalOpen(!modalOpen)} className="hover:bg-neutral-200 p-1 rounded">
                <TooltipWrap title={translation("toolbar.image", "insert image")}>
                    {iconComponentFor("add_photo")}
                </TooltipWrap>
            </button>
            {
                modalOpen && <Modal onClose={() => setModalOpen(false)}>
                    <ModalTab name="Velg">
                        <div className="w-screen max-w-xl flex flex-col space-y-8 mb-4">
                            <div className="w-full h-fit text-center text-lg">
                                Velg bilde
                            </div>
                        </div>
                    </ModalTab>
                    <ModalTab name="Last opp">
                        <div className="w-full flex flex-col space-y-8 mb-4">
                            <div className="w-full h-fit text-center text-lg">
                                Last opp
                            </div>
                            <div className="w-screen max-w-xl flex flex-col justify-center h-24">
                                <ImageUpload />
                            </div>
                        </div>
                    </ModalTab>
                </Modal>
            }
        </>
    )
});