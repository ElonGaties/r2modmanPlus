import ProviderUtils from '../../generic/ProviderUtils';
import ManifestV2 from '../../../model/ManifestV2';
import R2Error from '../../../model/errors/R2Error';
import BepInExTree from '../../../model/file/BepInExTree';

export default abstract class ProfileInstallerProvider {

    private static provider: () => ProfileInstallerProvider;
    static provide(provided: () => ProfileInstallerProvider): void {
        this.provider = provided;
    }

    public static get instance(): ProfileInstallerProvider {
        if (ProfileInstallerProvider.provider === undefined) {
            throw ProviderUtils.throwNotProvidedError('ProfileInstallerProvider');
        }
        return ProfileInstallerProvider.provider();
    }

    /**
     * Removes a mod from the profile. Does not affect the mod list display.
     * @param mod
     */
    public abstract uninstallMod(mod: ManifestV2): R2Error | null;

    /**
     * Disable files to prevent the mod from loading.
     * @param mod
     */
    public abstract disableMod(mod: ManifestV2): R2Error | void;

    /**
     * Enable files to undo a disable operation.
     * @param mod
     */
    public abstract enableMod(mod: ManifestV2): R2Error | void;

    /**
     * Installs a mod to the profile.
     * @param mod
     */
    public abstract installMod(mod: ManifestV2): R2Error | null;

    /**
     * Applies either enabling or disabling under a shared method.
     * Logic for both {@method enableMod} and {@method disableMod} should be handled here.
     *
     * @param mod
     * @param tree      A BepInExTree object to provide a list of all files provided in the mod.
     * @param location  The location of the mod within a BepInEx sub-folder.
     * @param mode      The ModMode number. {@class model/enums/ModMode}
     */
    abstract applyModMode(mod: ManifestV2, tree: BepInExTree, location: string, mode: number): R2Error | void;

    /**
     * Get descendant files of a given location.
     *
     * For params, see {@method applyModMode}
     * @param tree      If tree is not provided, one is created on first call. This method is recursive.
     * @param location
     */
    abstract getDescendantFiles(tree: BepInExTree | null, location: string): string[];

    /**
     * Install a mod based on a given {@class ManifestV2}. Used for local installs.
     *
     * @param mod
     * @param location
     */
    abstract installForManifestV2(mod: ManifestV2, location: string): R2Error | null;

    /**
     * Handles the installation of all mods excluding BepInEx.
     * Iterates through the BepInExTree provided to move files to their correct locations.
     *
     * @param location
     * @param folderName
     * @param mod
     * @param tree
     */
    abstract resolveBepInExTree(location: string, folderName: string, mod: ManifestV2, tree: BepInExTree): R2Error | null;

    /**
     * Custom install method for handling BepInEx installations.
     * @param bieLocation
     */
    abstract installBepInEx(bieLocation: string): R2Error | null;

}
