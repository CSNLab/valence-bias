from __future__ import print_function
import csv
import os
import random

numBlocksPerType = 4

allFaces = [img for img in os.listdir('../valence_img/faces') if img.endswith('jpg')]
ambFaces = [img for img in allFaces if ('SP' in img or 'SU' in img)]
hapFaces = [img for img in allFaces if 'HA' in img]
angFaces = [img for img in allFaces if 'AN' in img]

allScenes = [img for img in os.listdir('../valence_img/scenes') if img.endswith('jpg')]
ambScenes = [img for img in allScenes if img.startswith('A')]
posScenes = [img for img in allScenes if img.startswith('P')]
negScenes = [img for img in allScenes if img.startswith('N')]

faceSeqs, sceneSeqs = [], []

with open('stim.csv', 'r') as stimFile:
    reader = csv.reader(stimFile, delimiter=',')
    counter = 2 * numBlocksPerType
    for row in reader:
        if counter % 2 == 0:
            if counter <= numBlocksPerType:
                ambStim, posStim, negStim, stimSeqs = list(ambFaces), list(hapFaces), list(angFaces), faceSeqs
            else:
                ambStim, posStim, negStim, stimSeqs = list(ambScenes), list(posScenes), list(negScenes), sceneSeqs
            random.shuffle(ambStim)
            random.shuffle(posStim)
            random.shuffle(negStim)
        stimSeq = []
        for stimType in row:
            if stimType == '2':
                stimSeq.append(ambStim.pop())
            elif stimType == '1':
                stimSeq.append(posStim.pop())
            elif stimType == '0':
                stimSeq.append(negStim.pop())
        stimSeqs.append(stimSeq)
        counter -= 1
        if counter == 0:
            break
print(faceSeqs)
print(sceneSeqs)
with open('stimuli.csv', 'w') as outfile:
    writer = csv.writer(outfile)
    for seq in faceSeqs:
        writer.writerow(seq)
    for seq in sceneSeqs:
        writer.writerow(seq)
