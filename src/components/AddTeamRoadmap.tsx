import { useRef, useState } from 'react';
import { useOutsideClick } from '../hooks/use-outside-click';
import { type OptionType, SearchSelector } from './SearchSelector';
import type { PageType } from './CommandMenu/CommandMenu';
import { CheckIcon } from './ReactIcons/CheckIcon';
import { httpPut } from '../lib/http';
import type { TeamResourceConfig } from './CreateTeam/RoadmapSelector';
import { Spinner } from './ReactIcons/Spinner';

type AddTeamRoadmapProps = {
  teamId: string;
  allRoadmaps: PageType[];
  availableRoadmaps: PageType[];
  onClose: () => void;
  onMakeChanges: (roadmapId: string) => void;
  setResourceConfigs: (config: TeamResourceConfig) => void;
};

export function AddTeamRoadmap(props: AddTeamRoadmapProps) {
  const {
    teamId,
    onMakeChanges,
    onClose,
    allRoadmaps,
    availableRoadmaps,
    setResourceConfigs,
  } = props;
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<string>('');
  const popupBodyEl = useRef<HTMLDivElement>(null);

  async function addTeamResource(roadmapId: string) {
    if (!teamId) {
      return;
    }

    setIsLoading(true);
    const { error, response } = await httpPut<TeamResourceConfig>(
      `${import.meta.env.PUBLIC_API_URL}/v1-update-team-resource-config/${teamId}`,
      {
        teamId: teamId,
        resourceId: roadmapId,
        resourceType: 'roadmap',
        removed: [],
      }
    );

    if (error || !response) {
      setError(error?.message || 'Error adding roadmap');
      setIsLoading(false);
      return;
    }

    setResourceConfigs(response);
    setIsLoading(false);
  }

  useOutsideClick(popupBodyEl, () => {
    onClose();
  });

  const selectedRoadmapTitle = allRoadmaps.find(
    (roadmap) => roadmap.id === selectedRoadmap
  )?.title;

  return (
    <div className="popup fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md p-4">
        <div
          ref={popupBodyEl}
          className="popup-body relative rounded-lg bg-white p-6 shadow-lg transition-transform transform-gpu"
        >
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Spinner isDualRing={false} className="h-5 w-5 animate-spin text-gray-500" />
              <h2 className="ml-3 font-medium text-gray-700">Loading...</h2>
            </div>
          )}
          {!isLoading && !error && selectedRoadmap && (
            <div className="text-center">
              <CheckIcon additionalClasses="h-10 w-10 mx-auto mb-4 mt-6 text-green-500" />
              <h3 className="mb-2 text-2xl font-semibold text-gray-800">
                {selectedRoadmapTitle} Added
              </h3>
              <p className="mb-5 text-sm text-gray-500">
                <button
                  onClick={() => onMakeChanges(selectedRoadmap)}
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  Click here
                </button>{' '}
                to make changes to the roadmap.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  type="button"
                  className="flex-grow cursor-pointer rounded-lg bg-gray-200 py-2 text-center hover:bg-gray-300"
                >
                  Done
                </button>
                <button
                  onClick={() => {
                    setSelectedRoadmap('');
                    setError('');
                    setIsLoading(false);
                  }}
                  type="button"
                  className="flex-grow cursor-pointer rounded-lg bg-black py-2 text-center text-white hover:bg-gray-800"
                >
                  + Add More
                </button>
              </div>
            </div>
          )}
          {!isLoading && error && (
            <div className="text-center">
              <h3 className="mb-2 text-2xl font-semibold text-red-600">Error</h3>
              <p className="mb-4 text-sm text-red-400">{error}</p>
              <div className="flex justify-center">
                <button
                  onClick={onClose}
                  type="button"
                  className="cursor-pointer rounded-lg bg-gray-200 py-2 px-6 text-center hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {!isLoading && !error && !selectedRoadmap && (
            <div className="text-center">
              <h3 className="mb-2 text-2xl font-semibold text-gray-800">Add Roadmap</h3>
              <p className="mb-5 text-sm text-gray-500">Search and add a roadmap</p>
              <SearchSelector
                options={availableRoadmaps.map((roadmap) => ({
                  value: roadmap.id,
                  label: roadmap.title,
                }))}
                onSelect={(option: OptionType) => {
                  const roadmapId = option.value;
                  setIsLoading(true);
                  addTeamResource(roadmapId).finally(() => {
                    setSelectedRoadmap(roadmapId);
                  });
                }}
                inputClassName="mt-2 mb-4 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder={'Search for roadmap'}
              />
              <div className="flex justify-center">
                <button
                  onClick={onClose}
                  type="button"
                  className="cursor-pointer rounded-lg bg-gray-200 py-2 px-6 text-center hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
